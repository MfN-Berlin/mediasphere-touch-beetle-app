import { Box } from "@mui/material"
import { useEffect, useRef } from "react"

const AutoScrollContainer = props => {
    const {children, relativeScrollY, on, ...rest} = props;
    const outer = useRef()
    const inner = useRef()

    useEffect( ()=> {
        //console.log({relativeScrollY})
        if( on ){
        const outerElement = outer.current, innerElement = inner.current
         ;
         window.outerElement = outerElement
        if( innerElement && outerElement ){
            const outerHeight = outerElement.getBoundingClientRect().height,
                innerHeight = innerElement.getBoundingClientRect().height;
            
               
            if( outerHeight < innerHeight ){
                
                outerElement.scrollTop = (relativeScrollY * (outerElement.scrollHeight ) ) - outerHeight * 0.5
            }

        }
    }else{
        outer.current.scrollTop = 0
    }


    }, [relativeScrollY, inner, outer, on])

    return <Box ref={outer} sx={{overflowY: on ? 'hidden' : 'scroll', height: '100%'}} >
        <Box ref={inner} {...rest}>{children}
        </Box>
        </Box>
}

export default AutoScrollContainer