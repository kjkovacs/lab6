import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vobutlvkzvsmhupksube.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYnV0bHZrenZzbWh1cGtzdWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDYyNzAsImV4cCI6MjA5NTg4MjI3MH0.sv2hqpfzszLd6dT70XoMJjOvU0YbajRRozdQI-qUFXE'

const supabase = createClient(supabaseUrl, supabaseKey)

const articlesList = document.getElementById('articles-list')
const form = document.getElementById('add-article-form')

async function fetchArticles() {
  try {
    const apiUrl = `${supabaseUrl}/rest/v1/article`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Problem z pobieraniem danych: ${response.status}`)
    }

    const data = await response.json()

    articlesList.innerHTML = ''
    
    data.forEach(article => {
      const articleDate = article.created_at ? new Date(article.created_at).toLocaleDateString('pl-PL') : 'Brak daty'

      const div = document.createElement('div')
      div.className = 'border p-4 rounded shadow bg-white'
      div.innerHTML = `
        <h2 class="text-xl font-semibold">${article.title}</h2>
        <h3 class="text-gray-600">${article.subtitle}</h3>
        <p class="text-sm text-gray-400 mt-1">Autor: ${article.author} | Data: ${articleDate}</p>
        <p class="mt-4">${article.content}</p>
      `
      articlesList.appendChild(div)
    })
  } catch (error) {
    console.error('Błąd:', error)
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const title = document.getElementById('title').value
  const subtitle = document.getElementById('subtitle').value
  const author = document.getElementById('author').value
  const content = document.getElementById('content').value

  const { error } = await supabase
    .from('article')
    .insert([{ title, subtitle, author, content }])

  if (error) {
    console.error('Błąd dodawania artykułu:', error)
  } else {
    form.reset()
    fetchArticles()
  }
})

fetchArticles()
