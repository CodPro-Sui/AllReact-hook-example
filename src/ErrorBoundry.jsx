import React from "react";

class ErrorBoundry extends React.Component{
    constructor(props){
        super(props);
        this.state = {hasError: false,message: ""}
    }

    static getDerivedStateFromError(error){
        return {hasError: true,message: error.message}
    }

    componentDidCatch(err,info){
        console.log(err,info)
    }
    render(){
        if(this.state.hasError){
            return <h1>Something went wong 😭</h1>
        }
        return this.props.children
    }
}

export default ErrorBoundry