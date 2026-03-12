import React, { useEffect } from 'react'

const Btn = React.memo(({ click , children}) => {
    useEffect(() => {
        console.log("run once")
    },[])
    return <button onClick={click}>{children}</button>
})

export default Btn