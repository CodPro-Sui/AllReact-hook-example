import withUserData from "./withUserData"
const Show = ({data}) => {
  return (
    <div>{data?data.title:"Loading"}</div>
  )
}

export default withUserData(Show)