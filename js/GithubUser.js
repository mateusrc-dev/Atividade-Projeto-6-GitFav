export class GithubUser { 
  static search(username) { 
    const endpoint = `https://api.github.com/users/${username}` //local onde está os dados da aplicação que vai ser atribuído ao endpoint
    return fetch(endpoint).then(data => data.json()).then(data => {return {
      login: data.login,
      name: data.name,
      public_repos: data.public_repos,
      followers: data.followers
    }}) //fetch vai buscar as coisas na internet //fetch é uma promessa - quando essa promessa é finalizada é retornado um dado e em then esse dado vai ser transformado em json (já se espera que esse dado esteja em json) numa função - no outro then vamos criar um objeto dentro de uma função usando os dados em json
  }
} 