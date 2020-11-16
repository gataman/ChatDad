app.controller('chatController', ['$scope','chatFactory','userFactory', ($scope, chatFactory,userFactory) => {
    
    function init(){
        userFactory.getUser().then(user => {
            $scope.user = user
        })
    }

    init();
    
    $scope.onlineList = []
    $scope.roomList = []
    $scope.messageList = []
    $scope.activeTab = 1
    $scope.chatName = ""
    $scope.chatClciked = false
    $scope.message = ""
    $scope.roomId = ""
    $scope.user = {}
    
    const socket = io.connect('http://localhost:3000')

    socket.on('onlineList', users => {
        $scope.onlineList = users
        $scope.$apply();
    })

    socket.on('activeRooms', rooms => {
        $scope.roomList = rooms
        $scope.$apply();
    })

    $scope.changeTab = tab => {
        $scope.activeTab = tab

    }

    $scope.newMessage = () =>{
      
        socket.emit('newMessage',{
            message : $scope.message,
            roomId : $scope.roomId
        })

        $scope.message = ''

    }

    $scope.switchRoom = room => {
        $scope.chatClicked = true
        $scope.roomId = room.id
        $scope.chatName = room.roomName

        chatFactory.getMessages(room.id).then(data=>{
            $scope.messageList = data
        })



    }

    $scope.newRoom = () => {
        //let randomName = Math.random().toString(36).substring(7);

        let roomName = window.prompt("Enter room name");
        if (roomName !== '' && roomName !== null) {
            socket.emit('newRoom', roomName);
        }

    }







}]);