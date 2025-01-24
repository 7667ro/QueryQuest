import React, { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button" 
import { Card, CardContent } from "./card"
import { fetchSuggestions, searchQuestions } from "./questionClient"

const SearchComponent = () => {
  const [query, setQuery] = useState("")
  const [questions, setQuestions] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false) 
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== "") {
        fetchSuggestionsData(query)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const fetchSuggestionsData = async (query) => {
    try {
      const suggestionsData = await fetchSuggestions(query)
      setSuggestions(suggestionsData)
      // Show suggestions when data is fetched
      setShowSuggestions(true) 
    } catch (error) {
      console.error("Error fetching suggestions:", error.message)
    }
  }

  const fetchQuestionsData = async (page) => {
    setLoading(true)
    try {
      const { questions: fetchedQuestions, total: totalQuestions } = await searchQuestions(query, page, limit)
      setQuestions(fetchedQuestions)
      setTotal(totalQuestions)
    } catch (error) {
      console.error("Error occurred:", error.message)
      alert("Failed to fetch questions. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchQuestionsData(1)
    setShowSuggestions(false) 
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setSuggestions([])
    setShowSuggestions(false) 
    setCurrentPage(1)
    fetchQuestionsData(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchQuestionsData(page)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Questions</h1>
          <p className="text-lg text-gray-600">Find the answers you're looking for</p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSuggestions(true) 
                }}
                placeholder="Enter your search query"
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <Button onClick={handleSearch} className="min-w-[100px]" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <Card className="mt-2 absolute z-10 w-full max-w-3xl">
              <CardContent className="p-0">
                <ul className="divide-y">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {loading && (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {questions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <p className="text-sm font-bold text-gray-600">Total Questions: {total}</p>
            </div>

            <div className="space-y-4 mb-8">
              {questions.map((question, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{question.getTitle()}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.getType()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <button 
              className="border rounded-md p-1.5 border-gray-300 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNumber)}
                    className="min-w-[40px]"
                  >
                    {pageNumber}
                  </Button>
                )
              })}

             
                <button className="border rounded-md p-1.5 border-gray-300 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                
                >
                Next
                </button>
             
              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchComponent
