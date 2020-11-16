app.factory('userFactory',['$http',($http)=>{
    const getUser = ()=>{
        return $http({
            url : 'http://localhost:3000/getUser',
            method : 'GET'
        }).then(response =>{
            return response.data;
        }, (err)=>{
            console.error(err)
        })
    }

    return {
        getUser
    }
}])