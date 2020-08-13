const baseUrl = 'http://localhost:8079/lukeblog'
module.exports={
    devServer:{
        proxy:{
            '/user':{
                target:baseUrl,
                changeOrigin:true
            },
            '/admin':{
                target:baseUrl,
                changeOrigin:true
            }
        }
    }
};