import { useEffect, useState } from 'react'
import { Shape } from './Shape'
import { codeColors } from '../structs.js'

export const Content = ({language, category, data}) => {
    const [content, setContent] = useState(null)

    const isBoolean = (str) => str == 'true' || str == 'false'

    const buildContent = () =>{
        const tmpContent = []

        data = data.replaceAll('==>','>>>')
        const datas = data.split('>>>')
        
        var currentColor = ''
        var dotTriggered = false
        
        switch(category){
            case 'Arrays': case 'Lists':
                tmpContent.push(
                    <>
                    {datas[0] && datas[0].split('').map(c=>{
                        switch(c){
                            case '@': return <Shape type = "circle"></Shape>
                            case '^': return <Shape type = "triangle"></Shape>
                            case '.': currentColor = 'function-color'; return <span>.</span>
                            case '(': currentColor = ''; return <span>(</span>
                            case '"' : currentColor == '' ? currentColor = 'string-color' : currentColor = ''; return <span className = 'string-color'>"</span>
                            case ')': return <span>)</span>
                            default: return currentColor != '' ? <span className={currentColor}>{c}</span> : c
                        }
                    })}
                    <span style = {{float:'right'}}>
                        {datas[1] && datas[1].split('').map(c=>{
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
            case 'Maths':
                tmpContent.push(
                    <>
                    {datas[0] && datas[0].split('').map(c=>{
                        switch(c){
                            case '@': return <Shape type = "circle"></Shape>
                            case '^': return <Shape type = "triangle"></Shape>
                            case '.': 
                                if (!dotTriggered){
                                    currentColor = 'function-color'
                                    dotTriggered = true
                                    return <span>.</span>
                                } else {
                                    currentColor = 'number-color'
                                    return <span className = 'number-color'>.</span>
                                }
                            break
                            case ',': return <span>,</span>               
                            case '(': currentColor = 'number-color'; return <span>(</span>
                            case '+': currentColor = 'number-color'; return <span>+</span>
                            case ';': return <span>;</span>
                            case ')': currentColor = ''; return <span>)</span>
                            default: return currentColor != '' ? <span className={currentColor}>{c}</span> : c
                        }
                    })}
                    <span style = {{float:'right'}}>
                        <span className = 'number-color'>
                        {datas[1] && datas[1].split('').map(c=>{
                            return c
                        })}
                        </span>
                    </span>
                    <span className = "function-arrow">→</span>
                    </>
                )
                setContent(tmpContent)
            break
            case 'Functions':
                var lastColorIndex = -1
                console.log(datas[2])
                tmpContent.push(
                    <>
                        {datas[0] && datas[0].split('').map((c,i)=>{
                            switch(c){
                                case '%':
                                    const indexColor = codeColors.indexOf(datas[0][i+1]+datas[0][i+2])
                                    if (indexColor != -1){
                                        currentColor = codeColors[indexColor]
                                        lastColorIndex = i
                                    } else {
                                        return <span className = {`${currentColor}`}>{c}</span>
                                    }
                                break
                                default:
                                    if (i==datas[0].split('').length){
                                        lastColorIndex = -1
                                    }
                                    if (i-lastColorIndex>2)
                                        return <span className = {`${currentColor}`}>{c}</span>
                                break
                            }
                        })}
                        <p></p>
                        {datas[1] && datas[1].split('').map((c,i)=>{
                            switch(c){
                                case '%':
                                    const indexColor = codeColors.indexOf(datas[1][i+1]+datas[1][i+2])
                                    if (indexColor != -1){
                                        currentColor = codeColors[indexColor]
                                        lastColorIndex = i
                                    } else {
                                        return <span className = {`${currentColor}`}>{c}</span>
                                    }
                                break
                                default:
                                    if (i-lastColorIndex>2)
                                        return <span className = {`${currentColor}`}>{c}</span>
                                break
                            }
                        })}
                        <span style = {{float:'right'}}>
                            <span className = 'DW'>
                                {datas[2] && datas[2].split('').map(c=>{
                                    return c
                                })}
                            </span>
                        </span>
                    </>
                )
                setContent(tmpContent)
            break
        }
    }

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