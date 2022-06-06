class TodoService{
    static instance
    add(){
        console.log('from todo service')
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }

        return (this.instance = new TodoService());
    }
}

module.exports=TodoService