module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['index.html', 'Content/javascript/**/*.js'],
      safelist: {
        standard: [
          // Bootstrap 5 modal classes added dynamically
          'show',
          'fade',
          'modal-backdrop',
          'modal-open',
          // Materialize classes
          'toast',
          'toast-container',
          // Animation classes
          'animated',
          'flipInY',
          // Menu toggle states
          'menu-open',
          'body-push-toright',
          'active',
          'top-transform',
          'middle-transform',
          'bottom-transform',
          // Form states
          'valid',
          'invalid',
          // Visibility
          'is-hidden',
          'hide',
          'hidden'
        ],
        deep: [/modal/, /btn/, /form/, /input/, /card/],
        greedy: [/animate/, /scroll/]
      }
    }),
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true }
      }]
    })
  ]
};
