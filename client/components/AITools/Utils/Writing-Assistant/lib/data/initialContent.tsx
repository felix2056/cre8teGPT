export const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        textAlign: 'left',
        level: 1,
      },
      content: [
        {
          type: 'emoji',
          attrs: {
            name: 'pen',
          },
        },
        {
          type: 'text',
          text: ' The Ultimate Productivity Hack is Saying No',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'The ability to say no is a powerful productivity hack. It allows you to focus on what matters most and avoid distractions. In this article, we will explore the benefits of saying no and how you can use this simple word to improve your productivity and well-being. Source: ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.forbes.com/sites/kevinkruse/2016/03/07/why-successful-people-never-bring-smartphones-into-meetings/?sh=3b3b3b3b3b3b',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'Forbes',
        }
      ],
    }
  ],
}
