export const resolveIDsToDocs = async ids => {
  if( !ids || !ids.length ) return []
  const results = await pouchdb.allDocs({ include_docs: true, keys: ids })
  return results.rows.map(result => result.doc)
}



export const unpouchDoc = doc => {
  if( !doc ) return null
  const { _id, ...data } = doc
  return { id: _id, ...data }
}



export const unpouchDocs = docs => docs.map(unpouchDoc)
