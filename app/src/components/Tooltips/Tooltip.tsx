interface TooltipProps{
    text: string,
    position: "left"|"top"|"bottom"|"right"
}
let Tooltip:React.FC<TooltipProps> = (props) => {
    return(
        <div className="tooltip">
            {
                props.children
            }
            <span className={`tooltiptext tooltip-${props.position}`}>{props.text}</span>
        </div>
    )
}
export default Tooltip