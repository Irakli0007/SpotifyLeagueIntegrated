module.exports  = {
    publicPath: process.env.NODE_ENV  ===  'production'  ?  './'  :  '/',
    pluginOptions: {
      electronBuilder: {
        preload: '/preload.js',
      }
    },
    transpileDependencies: [  
      'vuetify'
    ]
}
