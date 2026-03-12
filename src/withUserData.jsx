import { useState, useEffect } from "react"
const withUserData = (Component) => {
    return function EnhanceFunc(props) {
        const [data, setData] = useState([]);
        useEffect(() => {
            fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json()).then(data => setData(data))
        }, [])
        return <Component data={data} {...props} />
    }
}

export default withUserData