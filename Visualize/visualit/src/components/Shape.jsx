

export const Shape = ({type}) =>{
    return (
        <span className={`obj-${type}`} style={{transform:'translateY(2px)'}}/>
    )
}