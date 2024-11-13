import { Node } from '@tiptap/core';
import { Node as ProsemirrorNode } from 'prosemirror-model';

const Iframe = Node.create({
    name: 'iframe',

    inline: false, // O iframe não deve ser inline

    group: 'block', // O iframe deve ser um bloco

    selectable: false, // Para evitar seleção

    atom: true, // Para que o iframe seja tratado como um único nó

    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: null,
            },
            height: {
                default: '300',
            },
            style: {
                default: 'width: 100%;',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe',
            },
        ];
    },

    renderHTML({ node }: { node: ProsemirrorNode }) {
        return [
            'iframe',
            {
                height: node.attrs.height,
                style: node.attrs.style,
                title: node.attrs.title,
                src: node.attrs.src,
                scrolling: 'no',
                frameborder: 'no',
                loading: 'lazy',
                allowtransparency: 'true',
                allowfullscreen: 'true',
            },
            // Pode incluir conteúdo alternativo, caso o iframe não seja carregado
        ];
    },
});

export default Iframe;
