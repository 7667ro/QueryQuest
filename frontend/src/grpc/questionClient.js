import { QuestionServiceClient } from "./question_grpc_web_pb"
import { SearchRequest } from "./question_pb"

const client = new QuestionServiceClient("http://localhost:8082", null, null)

export const fetchSuggestions = (query) => {
  return new Promise((resolve, reject) => {
    const request = new SearchRequest()
    request.setQuery(query)

    client.getSuggestions(request, {}, (err, response) => {
      if (err) {
        reject(err)
        return
      }
      resolve(response.getSuggestionsList())
    })
  })
}

export const searchQuestions = (query, page, limit) => {
  return new Promise((resolve, reject) => {
    const request = new SearchRequest()
    request.setQuery(query)
    request.setPage(page)
    request.setLimit(limit)

    client.searchQuestions(request, {}, (err, response) => {
      if (err) {
        reject(err)
        return
      }
      resolve({
        questions: response.getQuestionsList(),
        total: response.getTotal(),
      })
    })
  })
}