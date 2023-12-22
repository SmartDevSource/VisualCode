import { useEffect, useState } from 'react'
import { Shape } from './Shape'
import { textFormats } from '../structs.js'

export const Content = ({language, category, data}) => {
    const [content, setContent] = useState(null)

    const getColorType = (str) => {
        if (str.toLowerCase().includes("false") || str.toLowerCase().includes("true")) return 'boolean-color'
        if (str.includes('"')) return 'string-color'
        if (str.includes('[')) return 'array-color'
        return 'number-color'
    }

    const buildContent = () =>{
        const tmpContent = []
        
        console.log(data)
        
        data = data.replaceAll('==>','>>>')
        const datas = data.split('>>>')
        
        var currentColor = ''
        var lastColorIndex = -1

        switch(category){
            case 'Functions':
                tmpContent.push(
                    <>
                        {datas[0] && !datas[1] && <div className='functions-category text-center'>{datas[0].replace('[TITLE]', '')}</div> }
                        {datas[0] && datas[1] && datas[0].split('').map((c,i)=>{
                            switch(c){
                                case '%':
                                    const indexColor = textFormats.indexOf(datas[0][i+1]+datas[0][i+2])
                                    if (indexColor != -1){
                                        currentColor = textFormats[indexColor]
                                        lastColorIndex = i
                                    } else
                                        return <span className = {`${currentColor}`}>{c}</span>
                                break
                                default:
                                    if (i==datas[0].split('').length) lastColorIndex = -1
                                    if (i-lastColorIndex>2) return <span className = {`${currentColor}`}>{c}</span>
                                break
                            }
                        })}
                        <p></p>
                        {datas[1] && <div style={{marginBottom:'50px'}}>
                        {datas[1].split('').map((c,i)=>{
                            switch(c){
                                case '%':
                                    const indexColor = textFormats.indexOf(datas[1][i+1]+datas[1][i+2])
                                    if (indexColor != -1){
                                        currentColor = textFormats[indexColor]
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
                        </div>
                        }
                    </>
                )
                setContent(tmpContent)
            break
            default:
                tmpContent.push(
                <>
                    {datas[0] && !datas[1] && <div className='functions-category text-center'>{datas[0].replace('[TITLE]', '')}</div> }
                    {datas[0] && datas[1] && datas[0].split('').map((c,i)=>{
                        switch(c){
                            case '%':
                                const indexColor = textFormats.indexOf(datas[0][i+1]+datas[0][i+2])
                                if (indexColor != -1){
                                    currentColor = textFormats[indexColor]
                                    lastColorIndex = i
                                } else
                                    return <span className = {`${currentColor}`}>{c}</span>
                            break
                            default:
                                if (i==datas[0].split('').length) lastColorIndex = -1
                                switch(c){
                                    case '@': return <span className = {`obj-circle`}></span>
                                    case '^': return <span className = {`obj-triangle`}></span>
                                    default:
                                        if (i-lastColorIndex>2) return <span className = {`${currentColor}`}>{c}</span>
                                }
                            break
                        }
                    })}
                    <span className='function-arrow'>➜</span>
                    {datas[1] &&
                    <span style = {{float:'right'}}>
                    {datas[1].split('').map((c,i)=>{
                        switch(c){
                            case '%':
                                const indexColor = textFormats.indexOf(datas[1][i+1]+datas[1][i+2])
                                if (indexColor != -1){
                                    currentColor = textFormats[indexColor]
                                    lastColorIndex = i
                                } else {
                                    return <span className = {`${currentColor}`}>{c}</span>
                                }
                            break
                            default:
                                if (i==datas[1].split('').length) lastColorIndex = -1
                                switch(c){
                                    case '@': return <span className = {`obj-circle`}></span>
                                    case '^': return <span className = {`obj-triangle`}></span>
                                    default:
                                        if (i-lastColorIndex>2) return <span className = {`${currentColor}`}>{c}</span>
                                }
                            break
                        }
                    })}
                    </span>
                    }
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