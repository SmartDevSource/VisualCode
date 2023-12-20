import { useEffect, useState } from 'react'
import { Shape } from './Shape'

export const Content = ({category, data}) => {
    const [content, setContent] = useState(null)

    const isBoolean = (str) => str == 'true' || str == 'false'

    const buildContent = () =>{
        const tmpContent = []

        data = data.replace('==>','>')
        const datas = data.split('>')
        
        var currentColor = ''

        switch(category){
            case 'Arrays':
                tmpContent.push(
                    <>
                    {datas[0].split('').map(c=>{
                        switch(c){
                            case '@': return <Shape type = "circle"></Shape>
                            case '^': return <Shape type = "triangle"></Shape>
                            case '.': currentColor = 'function-color'; return <span>.</span>; break
                            case '(': currentColor = ''; return <span>(</span>; break
                            case '"' : currentColor == '' ? currentColor = 'string-color' : currentColor = ''; return <span className = 'string-color'>"</span>; break
                            case ')': return <span>)</span>; break
                            default: return currentColor != '' ? <span className={currentColor}>{c}</span> : c
                        }
                    })}
                    <span style = {{float:'right'}}>
                        {datas[1].split('').map(c=>{
                            switch(c){
                                case '@': return <Shape type = "circle"></Shape>
                                case '^': return <Shape type = "triangle"></Shape>
                                default: return c
                            }
                        })}
                    </span>
                    <span className = "function-arrow">→</span>
                    </>
                )

                setContent(tmpContent)
            break
            case 'Strings':
                const strFirstPart = datas[0].split('.')

                const mainStr = strFirstPart[0]
                const functionStr = strFirstPart[1].split('(')[0]
                const functionStrParams = strFirstPart[1].split('(')[1].slice(0,-1) || ''

                const strSecondPart = datas[1].split('.')

                tmpContent.push(
                    <>
                    <span className = "string-color">{mainStr}.</span>
                    <span className = "function-color">{functionStr}</span>
                    <span>(</span>
                    <span className = "string-color">{functionStrParams}</span>
                    <span className = "parenthesis-color">)</span>
                    <span className = "function-arrow">→</span>
                    <span style = {{float:'right'}}>
                        <span className = { isBoolean(strSecondPart) ? `boolean-color` : 'string-color'}>{strSecondPart}</span>
                    </span>
                    </>
                )
                setContent(tmpContent)

            break
        }
    }

    "test".startsWith()

    useEffect(()=>{
        if (data){
            buildContent()
        }
    },[category, data])

    return (
        <>
        {content && 
            <div style = {{margin:'10px'}}>
                {content}
            </div>
        }
        </>
    )
}