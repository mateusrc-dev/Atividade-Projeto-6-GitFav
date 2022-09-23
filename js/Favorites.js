import { GithubUser } from './GithubUser.js';

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root) //atribuição do id app a root
    this.load()
  }

load() {
  this.entries = JSON.parse(localStorage.getItem('@github/favorites:')) || []
  const box2 = document.querySelector('.box2')
  if (this.entries.length == 0) {
    box2.classList.remove('none');
  } else if (this.entries.length != 0) {
    box2.classList.add('none');
  }
}

save() {
  localStorage.setItem('@github/favorites:', JSON.stringify(this.entries))
}

async add(username) { //função assíncrona
  try {
    const userExists = this.entries.find(entry => entry.login === username)
    if (userExists) {
      throw new Error('Usuário já cadastrado!')
    }
    const user = await GithubUser.search(username)
    if (user.login === undefined) {
      throw new Error('Usuário não encontrado!')
    }
    this.entries = [user, ...this.entries]
    this.update()
    this.save()
  } catch (error) {
    alert(error.message)
  }
}

delete(user) {
  const filterEntries = this.entries.filter((entry => entry.login !== user.login))
  this.entries = filterEntries
  if (this.entries.length == 0) {
    const box2 = document.querySelector('.box2')
    box2.classList.remove('none')
  } 
  this.save()
  this.update()
}

}

//classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) { //no parâmetro root tem o id app que foi passado como argumento
    super(root)
    this.body = this.root.querySelector('tbody') //pegando a parte que tem os usuários e colocando em body
    this.update() //chamando a função que faz as atualizações no html
    this.onadd() //função que pega os o nome do usuário que inserimos no input
  }

onadd() { //função que pega os o nome do usuário que inserimos no input
  const addButton = this.root.querySelector('.button')
  addButton.onclick = () => {
    const {value} = this.root.querySelector('.search input') //pegando somente o valor que foi digitado no input
    this.add(value) //enviando como argumento o valor do input para a função add
    const box2 = document.querySelector('.box2')
    box2.classList.add('none')
  }
}

update() { //função que faz as atualizações no HTML
  this.removeAllbox() //precisamos começar tirando todos os box que estão no index.html
  this.entries.forEach(user => {
    const row = this.createRow()
    row.querySelector('.user').src = `https://github.com/${user.login}.png`
    row.querySelector('.name').textContent = user.name
    row.querySelector('.user').alt = `Imagem de ${user.name}`
    row.querySelector('.link').href = `https://github.com/${user.login}`
    row.querySelector('.linkname').textContent = user.login
    row.querySelector('.repositories ').textContent = user.public_repos
    row.querySelector('.followers').textContent = user.followers
    row.querySelector('.remove').onclick = () => {
      const isOk = confirm('Tem certeza que deseja deletar essa linha?')
      if (isOk) {
        this.delete(user) //chamando a função delete e passando como argumento o user (que seria o object que está passando agora)
      } 
    } 
    this.body.append(row)
  })
}

createRow() { //através dessa função vamos criar as linhas com os dados
  const rows = document.createElement('tr') //criando um novo elemento e colocando os dados nele, vamos depois mudar esses dados
  rows.classList.add('rows')
  const data = `
  <td class="row">
            <div>
            <img class="user" src="https://github.com/maykbrito.png" alt="imagem do maykbrito">
            </div>
            <div>
            <a class="link" href="https://github.com/maykbrito" target="_blank">
            <p class="name">Mayk Brito</p>
            <span class="linkname">/maykbrito</span></a>
            </div>
          </td>
          <td class="repositories">76</td>
          <td class="followers">9578</td>
          <td class="remov"><button class="remove">Remover</button></td>
  `
  rows.innerHTML = data
  return rows
}

removeAllbox() {
  this.body.querySelectorAll('.rows').forEach((rows) => {rows.remove()}) //pegando todos os usuários do arquivo index.html e deletando
}
}

