import { db } from '../firebase'
import store from '../store'

export const get = (_collection, _id = null) => {
  return new Promise((res, rej) => {
    (async () => {
      try{
        const capitalize = _collection.charAt(0).toUpperCase() + _collection.slice(1)
        const setCollection = 'set' + capitalize
        const setDocument = 'set' + capitalize.slice(0, -1)

        store.commit('setLoading', 'get')
        // store.commit('setError', null)

        if(_id !== null) {
          const document = db.collection(_collection).doc(_id)
          let result = await document.get()
          if(!result.exists) { return }
            let response = result.data()
            response.id = _id

            store.commit(_collection + '/' + setDocument, response)
            store.commit('setLoading', null)
            return response
        } else {
          let query = db.collection(_collection)
          let response = []

          await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs

            for (let doc of docs) {
              var selectedItem = doc.data()
              selectedItem.id = doc.id
              response.push(selectedItem)
            }

            store.commit(_collection + '/' + setCollection, response)
            return res(response)
          })
        }

        store.commit('setLoading', null)
      }
      catch (error) {
        var message = `Error at API.get(${ _collection }/${ _id }): ${ error }`

        store.dispatch('notifications/post', {
          title: `Terjadi kesalahan.`,
          body: message,
          timeout: 10
        }, { root: true })
        store.commit('setLoading', null)
        store.commit('setError', message)
        return rej(error)
      }
    })()
  })
}


export const getBy = (_collection, _by, _value) => {
  return new Promise((res, rej) => {
    (async () => {
      try{
        const capitalize = _collection.charAt(0).toUpperCase() + _collection.slice(1)
        const setCollection = 'set' + capitalize
        const setDocument = 'set' + capitalize.slice(0, -1)

        store.commit('setLoading', 'get')
        // store.commit('setError', null)
        let query = db.collectionGroup(_collection)
        .where(_by, '==', _value)
        let response = []

        await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs

          for (let doc of docs) {
            var selectedItem = doc.data()
            selectedItem.id = doc.id
            response.push(selectedItem)
          }

          store.commit(_collection + '/' + setCollection, response)
          return res(response)
        })

        store.commit('setLoading', null)
      }
      catch (error) {
        var message = `Error at API.get(${ _collection }/${ _by }(${ _value })): ${ error }`

        store.dispatch('notifications/post', {
          title: `Terjadi kesalahan.`,
          body: message,
          timeout: 10
        }, { root: true })
        store.commit('setLoading', null)
        store.commit('setError', message)
        return rej(error)
      }
    })()
  })
}

export const post = (_collection,  _data, _title) => {
  return new Promise((res, rej) => {
    (async () => {
      try{
        store.commit('setLoading', 'post')
        store.commit('setError', null)

        delete _data.id

        var document = db.collection(_collection).doc()

        await document.set(_data)

        store.commit('setLoading', null)
        store.dispatch('notifications/post', {
          body: `${ _title } berhasil ditambahkan.`,
        })

        return res(document.id)
      }
      catch (error) {
        var message = `Error adding ${ _title } at API.post( ${ _collection }): ${ error }`

        store.dispatch('notifications/post', {
          title: `${ _title } gagal ditambahkan.`,
          body: error,
          timeout: 10
        }, { root: true })
        store.commit('setLoading', null)
        store.commit('setError', message)

        return rej(error)
      }
    })()
  })
}

export const remove = (_collection, _data, _title) => {
  return new Promise((res, rej) => {
    (async () => {
      try{
        store.commit('setLoading', 'post')
        store.commit('setError', null)

        var document = db.collection(_collection).doc(_data.id)
        await document.delete()

        store.commit('setLoading', null)
        store.dispatch('notifications/post', {
          body: `${ _title } berhasil dihapus.`,
        })

        return res()
      }
      catch (error) {
        var message = `Error removing ${ _title } at API.remove(${ _collection }/${ _data.id }):  ${ error }`

        store.dispatch('notifications/post', {
          title: `${ _title } gagal ditambahkan.`,
          body: error,
          timeout: 10
        }, { root: true })
        store.commit('setLoading', null)
        store.commit('setError', message)

        return rej(error)
      }
    })()
  })
}

export const put = (_collection, _data, _title) => {
  return new Promise((res, rej) => {
    (async () => {
      try{
        store.commit('setLoading', 'post')
        store.commit('setError', null)
        const _id = _data.id
        delete _data.id
        delete _data.createdAt

        var document = db.collection(_collection).doc(_id)
        await document.set(_data, { merge: true })

        store.commit('setLoading', null)
        store.dispatch('notifications/post', {
          body: `${ _title } berhasil diedit.`,
        })

        return res()
      }
      catch (error) {
        var message = `Error editing ${ _title } at API.post( ${ _collection }): ${ error }`

        store.dispatch('notifications/post', {
          title: `${ _title } gagal diedit.`,
          body: error,
          timeout: 10
        }, { root: true })
        store.commit('setLoading', null)
        store.commit('setError', message)

        return rej(error)
      }
    })()
  })
}
