/**
 * Created by seal on 21/01/2017.
 */

export const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
export const UPDATE_ARTICLES =  'UPDATE_ARTICLES'
export const UPDATE_RECORDS_CACHE =  'UPDATE_RECORDS_CACHE'
export const UPDATE_NUM = 'UPDATE_NUM'
export const UPDATE_USERS = 'UPDATE_USERS'
export const UPDATE_OUT_RECORDS = 'UPDATE_OUT_RECORDS'
export const REQUEST_OUT_RECORDS = 'REQUEST_OUT_RECORDS'
export const UPDATE_IN_RECORDS =  'UPDATE_IN_RECORDS'
export const REQUEST_IN_RECORDS =  'REQUEST_IN_RECORDS'

export const SYSTEM_LOADED = 'SYSTEM_LOADED'
export const ONLINE_USER_CHANGE = 'ONLINE_USER_CHANGE'
export const UPDATE_ARTICLE_SIZES = 'UPDATE_ARTICLE_SIZES'
export const REMOVE_PROJECT = 'REMOVE_PROJECT'


export function updateArticleSizes(id, sizes) {
  return {
    type: UPDATE_ARTICLE_SIZES,
    data: {
      id,
      sizes
    }
  }
}


export function removeProject(id) {
  return {
    type: REMOVE_PROJECT,
    data: id
  }
}