const express = require("express");
const cors = require("cors");

const { uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validatePorjectId (request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID' })
  }
  return next();
}




app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repostory = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repostory);

  return response.status(200).json(repostory)
});

app.put("/repositories/:id", validatePorjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository no found!!" })
  }
  var { likes } = repositories[repositoryIndex]
  const { 
    title,
    url,
    techs,
   } = request.body
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }


  repositories[repositoryIndex] = repository;


  return response.json(repository)
});

app.delete("/repositories/:id", validatePorjectId, (request, response) => {
  const {id } = request.params
  const repositoryIndex = repositories.findIndex((repository)=> repository.id ===id)
  if(repositoryIndex<0){
    return response.status(400).json({ error: 'repository not found !!'})
  }
  repositories.splice(repositoryIndex,1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", validatePorjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository no found!!" })
  }
 
  var {likes ,title,techs,url } = repositories[repositoryIndex]
  likes ++
  const repository = {
    id,
    title,
    url,
    techs,
    likes }


  repositories[repositoryIndex] = repository;
  return response.json(repository)
});

module.exports = app;
