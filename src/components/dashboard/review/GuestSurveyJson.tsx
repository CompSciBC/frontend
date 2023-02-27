export const guestSurveyJson = {
  title: 'Guest Experience Feedback Survey',
  description: 'Your opinion matters to us!',
  elements: [
    {
      type: 'panel',
      name: 'panel1',
      title: 'Please Rate The BeMyGuest Application',
      elements: [
        {
          type: 'radiogroup',
          name: 'discovery-source',
          title: 'How did you first hear about us?',
          choices: [
            'Search engine (Google, Bing, etc.)',
            'Online newsletter',
            'Blog post',
            'Word of mouth',
            'Social media'
          ],
          showOtherItem: true,
          otherPlaceholder: 'Please specify...',
          otherText: 'Other'
        },
        {
          type: 'matrix',
          name: 'quality',
          title: 'Please score the following aspects of BeMyGuest',
          columns: [1, 2, 3, 4, 5],
          rows: [
            {
              text: 'BeMyGuest improves my communication with my host',
              value: 'communication-needs-are-met'
            },
            {
              text: 'BeMyGuest provides important information',
              value: 'information-needs-are-met'
            },
            {
              text: 'The BeMyGuest site is easy to use and navigate',
              value: 'ease-of-use'
            },
            {
              text: 'Some product features require improvement',
              value: 'improvements-required'
            }
          ],
          columnMinWidth: '40px',
          rowTitleWidth: '300px'
        },
        {
          type: 'ranking',
          name: 'product-aspects-ranked',
          title:
            'These are some important aspects of the product. Rank them in terms of your priority.',
          description:
            'From the highest (the most important) to the lowest (the least important).',
          choices: [
            'Technical support',
            'Guidebook',
            'Dashboard - Weather Information',
            'Dashboard - Maps Information',
            'Dashboard - Events and Places Information',
            'Dashboard - Restaurants Information',
            'Chat with Host',
            'Group chat with other guests in the party'
          ]
        },
        {
          type: 'comment',
          name: 'suggestions-bmg',
          title: 'What would make you more satisfied with BeMyGuest?'
        }
      ]
    },
    {
      type: 'panel',
      name: 'panel2',
      title: 'Please Rate Your Rental Experience',
      elements: [
        {
          type: 'radiogroup',
          name: 'booking-platform',
          title: 'Where did you find this listing?',
          choices: ['Expedia.com', 'Vrbo', 'Airbnb'],
          showOtherItem: true,
          otherPlaceholder: 'Please specify...',
          otherText: 'Other'
        },
        {
          type: 'matrix',
          name: 'quality',
          title: 'Please score the following aspects of your stay',
          columns: [1, 2, 3, 4, 5],
          rows: [
            {
              text: 'Easy of communication with Host',
              value: 'host-communication'
            },
            { text: 'Cleanliness', value: 'cleanliness' },
            { text: 'Amenities match expectations', value: 'amenities' },
            { text: 'Guidebook information is complete', value: 'guidebook' }
          ],
          columnMinWidth: '40px',
          rowTitleWidth: '300px'
        },
        {
          type: 'comment',
          name: 'suggestions-rental',
          title:
            'What would make you more satisfied with your rental experience?'
        },
        {
          type: 'boolean',
          name: 'have-additional-thoughts',
          title: "Is there anything you'd like to add?"
        },
        {
          type: 'comment',
          name: 'additional-thoughts',
          visibleIf: '{have-additional-thoughts} = true',
          titleLocation: 'hidden',
          placeholder: 'Please share your thoughts...'
        }
      ]
    }
  ],
  showProgressBar: 'top',
  progressBarType: 'questions',
  widthMode: 'static',
  width: '864px'
};
