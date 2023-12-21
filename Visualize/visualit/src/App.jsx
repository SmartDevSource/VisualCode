import { useEffect, useState } from 'react'

// COMPONENTS //
import { Header } from './components/Header'
import { Content } from './components/Content'
// DATABASE //
import { getDatabase } from './functions/database_manager'
// ROUTES //
import { HOST_URL } from './routes'

const App = () => {
  const [data, setData] = useState(null)
  const [languages, setLanguages] = useState(null)
  const [languagesData, setLanguagesData] = useState(null)
  const [currentLanguage, setCurrentLanguage] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentData, setCurrentData] = useState(null)

  const divideSections = () =>{
    const set = new Set()
    data.forEach(dat=> set.add(dat.language))
    const uniques_languages = [...set]

    var languages_data = []

    uniques_languages.forEach(language=> {
      const current_data = data.filter(e=> e.language == language)
      const categories_set = new Set()
      const contents_set = new Set()
  
      current_data.forEach(curr=>{
        if (curr.category) categories_set.add(curr.category)
        if (curr.content) contents_set.add(curr.content)
      })

      var categories = []

      const uniques_categories = [...categories_set]
      uniques_categories.forEach(category=>{
        const cat = (current_data.filter(e=> { if (e.content!=null) return e.category == category}))
        const data = []
        cat.forEach(e=>{
          if (e.content!=null)
            data.push(e.content)
        })
        categories.push({category,data})
      })

      languages_data.push({language, categories})
    })
    
    setLanguages(uniques_languages)
    setLanguagesData(languages_data)
  }
  //****************************** HANDLING CLICKS ******************************//
  const handleLanguageSelection = (language) =>{
    setCurrentCategory(null)
    setCurrentLanguage(language)
  }

  const handleCategorySelection = (category) =>{
    setCurrentCategory(category)
  }

  //****************************** USE EFFECTS ******************************//
  useEffect(()=>{
    const fetchDatabase = async() =>{
      try{
        const database = await getDatabase(HOST_URL+'/api/data')
        setData(database)
      } catch (error) {
        console.log("Erreur ", error)
      }
    }
    fetchDatabase()
  },[])

  useEffect(()=>{ 
    if (data) divideSections() 
  },[data])

  useEffect(()=>{
    if (currentLanguage){
      const curr = languagesData.find(e=>e.language == currentLanguage)

      setCurrentData(curr)

      const div_categories = document.getElementById("div_categories")
      if (div_categories.classList.contains("hidden")){
        div_categories.classList.remove("hidden")
        div_categories.classList.add("appear")
      }
    }
  },[currentLanguage])

  useEffect(()=>{
    const div_contents = document.getElementById("div_contents")
    if (currentCategory){
      if (div_contents.classList.contains("hidden")){
        div_contents.classList.remove("hidden")
        div_contents.classList.add("appear")
      }
    } else {
      if (div_contents.classList.contains("appear")){
        div_contents.classList.remove("appear")
        div_contents.classList.add("hidden")
      }
    }
  },[currentCategory])

  return (
    <>
      <Header></Header>
        <div className = 'grid3-bloc'>
          {/********************LANGAGES{/********************/}
          <div className = 'bloc mw-min' style ={{width:'200px'}}>
            <div className = 'bloc-header'>Langages</div>
            {languages && languages.map(language=>{
              return (
                <p key = {language.id} onClick={()=>handleLanguageSelection(language)} className='bloc-word big-res-typo text-center' style={{position:'relative'}}>
                  {language}
                  {currentLanguage == language && 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" className= "right-arrow" viewBox="0 0 24 24"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" fill="currentColor"></path></svg>                
                  }
                </p>
              )
            })
            }
          </div>
          {/********************CATEGORIES{/********************/}
          <div className = 'bloc hidden mw-min' id = 'div_categories'>
            <div className = 'bloc-header'>Catégories</div>
            {currentData && currentData['categories'] && currentData['categories'].map(category=>{
                return (
                  <p key = {category.id} onClick={()=>handleCategorySelection(category)} className='bloc-word big-res-typo text-center' style={{position:'relative'}}>
                  {category.category}
                  {currentCategory && currentCategory['category'] == category.category && 
                    <svg xmlns="http://www.w3.org/2000/svg" className= "right-arrow" viewBox="0 0 24 24"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" fill="currentColor"></path></svg>                
                  }
                </p>                  
                )
            })}
          </div>
          {/********************CONTENUS{/********************/}
          <div className = {`bloc hidden ${currentCategory && currentCategory.category != 'Functions' ?'mw-standard' : 'mw-max'}`} id = 'div_contents'>
            <div className = 'bloc-header'>Fonctions</div>
            {currentCategory && currentCategory['data'] && currentCategory['data'].map(content=>{
              return(
                <span key = {content.id} className='bloc-word' style={{position:'relative'}}>
                  <Content language = {currentLanguage} category = {currentCategory.category} data = {content}></Content>
                </span>
              )
            })}
          </div>
        </div>
    </>
  )
}

export default App