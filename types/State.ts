export interface KlevuSettings {
  limit: number,
  typeOfRecords: [string],
  fields: any[],
  sort: string

}

export interface KlevuSuggestion {
  id: string,
  typeOfQuery: string,
  limit: number
}
export interface KlevuRecordQueries {
  id: string,
  typeOfRequest: string
}

export interface KlevuState {
  settings: KlevuSettings,
  suggestionSetting: KlevuSuggestion,
  suggestions: any[],
  recordQueries: KlevuRecordQueries,
  searchString: string,
  products: any[],
  categories: any[],
  pages: any[],
  loading: boolean
}
