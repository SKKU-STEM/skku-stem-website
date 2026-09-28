// Sveltia CMS 커스텀 필드 'subsup' — 논문 제목에 <sub>/<sup> 첨자를 넣는 버튼·단축키와 사이트와 같은 미리보기
// src/pages/admin/index.astro가 CMS 초기화 전에 registerSubSupField()로 등록한다.
import { formatChemistry, stripTitleMarkup } from '@/utils/chemistry';

type Tag = 'sub' | 'sup';

/** 편집 결과: 새 값 + 적용 후 선택 영역 */
export interface Edit {
  value: string;
  start: number;
  end: number;
}

/**
 * 선택 영역을 <tag>로 감싼다. 이미 같은 태그로 감싸져 있으면(태그가 선택 바깥이든 안쪽이든) 해제한다.
 * 선택이 없으면 빈 태그를 넣고 커서를 태그 안에 둔다.
 */
export function toggleTag(value: string, start: number, end: number, tag: Tag): Edit {
  const open = `<${tag}>`;
  const close = `</${tag}>`;
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);

  if (before.endsWith(open) && after.startsWith(close)) {
    return {
      value: before.slice(0, -open.length) + selected + after.slice(close.length),
      start: start - open.length,
      end: end - open.length,
    };
  }
  if (selected.length >= open.length + close.length && selected.startsWith(open) && selected.endsWith(close)) {
    const inner = selected.slice(open.length, -close.length);
    return { value: before + inner + after, start, end: start + inner.length };
  }
  return {
    value: before + open + selected + close + after,
    start: start + open.length,
    end: end + open.length,
  };
}

/** 선택 영역의 첨자 태그를 모두 뗀다. 선택이 없으면 제목 전체에서 뗀다. */
export function clearTags(value: string, start: number, end: number): Edit {
  if (start === end) {
    const cleared = stripTitleMarkup(value);
    return { value: cleared, start: cleared.length, end: cleared.length };
  }
  const cleared = stripTitleMarkup(value.slice(start, end));
  return {
    value: value.slice(0, start) + cleared + value.slice(end),
    start,
    end: start + cleared.length,
  };
}

// ─── Sveltia 연동 — Sveltia가 window에 노출하는 React 헬퍼(h, createClass)로 컴포넌트를 만든다 ───

type H = (type: unknown, props?: Record<string, unknown> | null, ...children: unknown[]) => unknown;

export interface SveltiaGlobals {
  h: H;
  createClass: (spec: object) => unknown;
  CMS: {
    registerFieldType: (name: string, control: unknown, preview?: unknown) => void;
  };
}

interface ControlProps {
  value?: string;
  forID?: string;
  classNameWrapper?: string;
  onChange: (value: string) => void;
}

interface ControlThis {
  props: ControlProps;
  textarea: HTMLTextAreaElement | null;
  apply(edit: Edit): void;
  run(action: (value: string, start: number, end: number) => Edit): void;
}

interface KeyEvent {
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  code: string;
  preventDefault(): void;
}

export function registerSubSupField({ h, createClass, CMS }: SveltiaGlobals): void {
  const toolButton = (label: string, title: string, onClick: () => void) =>
    h(
      'button',
      {
        type: 'button',
        className: 'subsup-button',
        title,
        // 버튼을 눌러도 textarea의 선택 영역이 풀리지 않게 포커스 이동을 막는다
        onMouseDown: (e: Event) => e.preventDefault(),
        onClick,
      },
      label,
    );

  const control: ThisType<ControlThis> & object = {
    textarea: null,

    apply(edit: Edit) {
      this.props.onChange(edit.value);
      // 값이 바뀌면 React가 커서를 끝으로 보내므로, 다시 그린 뒤 선택 영역을 복원한다
      requestAnimationFrame(() => {
        this.textarea?.focus();
        this.textarea?.setSelectionRange(edit.start, edit.end);
      });
    },

    run(action: (value: string, start: number, end: number) => Edit) {
      const ta = this.textarea;
      if (!ta) return;
      this.apply(action(this.props.value ?? '', ta.selectionStart, ta.selectionEnd));
    },

    render() {
      const value = this.props.value ?? '';
      return h(
        'div',
        { className: 'subsup-field' },
        h(
          'div',
          { className: 'subsup-toolbar', role: 'toolbar', 'aria-label': '첨자 편집' },
          toolButton('X₂ 아래첨자', '선택한 글자를 아래첨자로 (Ctrl+=)', () =>
            this.run((v, s, e) => toggleTag(v, s, e, 'sub')),
          ),
          toolButton('X² 위첨자', '선택한 글자를 위첨자로 (Ctrl+Shift+=)', () =>
            this.run((v, s, e) => toggleTag(v, s, e, 'sup')),
          ),
          toolButton('첨자 지우기', '선택 영역(선택이 없으면 전체)의 첨자 태그 제거', () =>
            this.run(clearTags),
          ),
        ),
        h('textarea', {
          id: this.props.forID,
          className: `subsup-input ${this.props.classNameWrapper ?? ''}`,
          rows: 3,
          value,
          ref: (el: HTMLTextAreaElement | null) => {
            this.textarea = el;
          },
          onChange: (e: { target: HTMLTextAreaElement }) => this.props.onChange(e.target.value),
          onKeyDown: (e: KeyEvent) => {
            // Word와 같은 단축키: Ctrl+= 아래첨자, Ctrl+Shift+= 위첨자
            if ((e.ctrlKey || e.metaKey) && e.code === 'Equal') {
              e.preventDefault();
              this.run((v, s, en) => toggleTag(v, s, en, e.shiftKey ? 'sup' : 'sub'));
            }
          },
        }),
        h(
          'div',
          { className: 'subsup-preview' },
          h('span', { className: 'subsup-preview-label' }, '사이트 표시'),
          // formatChemistry 출력은 <sub>/<sup> 외 HTML이 모두 escape된 안전한 문자열
          h('div', { dangerouslySetInnerHTML: { __html: formatChemistry(value) } }),
        ),
      );
    },
  };

  const preview = {
    render(this: { props: { value?: string } }) {
      return h('span', { dangerouslySetInnerHTML: { __html: formatChemistry(this.props.value ?? '') } });
    },
  };

  CMS.registerFieldType('subsup', createClass(control), createClass(preview));
}
