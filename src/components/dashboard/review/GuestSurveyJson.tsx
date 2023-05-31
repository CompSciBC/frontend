export const guestSurveyJson = {
  logo: '/bmg-branding/BMG-Script-RdHrt.svg',
  logoWidth: '200px',
  logoHeight: '80px',
  logoFit: 'cover',
  logoPosition: 'right',
  title: 'Guest Experience Feedback Survey',
  description: `Thank you for choosing to stay with us. We hope that you enjoyed your time here and that you had a comfortable and memorable experience. We would appreciate it if you could take a few minutes to complete this satisfaction survey to help us improve our service.`,
  elements: [
    {
      type: 'panel',
      name: 'panel1',
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
          name: 'quality-rental',
          title:
            'Please rate the following aspects of your stay on a scale of 1-5, where 1 is "very poor" and 5 is "excellent"',
          isRequired: true,
          columns: [1, 2, 3, 4, 5],
          rows: [
            { text: 'Cleanliness', value: 'cleanliness' },
            { text: 'Comfort', value: 'comfort' },
            { text: 'Location', value: 'location' },
            { text: 'Value for money', value: 'value-for-money' },
            {
              text: 'Ease of communication with host',
              value: 'host-communication-ease'
            },
            {
              text: 'Timeliness of communication with host',
              value: 'host-communication-timeliness'
            },
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
          title:
            'Is there anything else you would like to share about your experience?'
        },
        {
          type: 'comment',
          name: 'additional-thoughts',
          visibleIf: '{have-additional-thoughts} = true',
          titleLocation: 'hidden',
          placeholder: 'Please share your thoughts...'
        }
      ]
    },
    {
      type: 'panel',
      name: 'panel2',
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
          name: 'quality-bmg',
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
    }
  ],
  showProgressBar: 'top',
  progressBarType: 'questions',
  widthMode: 'responsive',
  width: '85%',
  completedHtml:
    '<p><h4>Thank you for your feedback!</h4></p><p>Navigating back to Dashboard in 3...2...1...</p>'
};

export const guestSurveyQuestionsMap = {
  'discovery-source': 'How did you first hear about us?'
};
