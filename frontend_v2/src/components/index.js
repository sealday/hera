/**
 * Created by seal on 25/01/2017.
 */
import React from 'react'

export const Input = ({ input }) => (
  <input {...input} className="form-control" />
)

export const Select = ({ input, children }) => (
  <select {...input} className="form-control" >{children}</select>
)
