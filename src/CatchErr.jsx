import React from 'react'

const CatchErr = ({data}) => {
    if(!data) throw new Error("no found")
    return (
        <>
            <div>Hello codpro 👋</div>
        </>
    )
}

export default CatchErr