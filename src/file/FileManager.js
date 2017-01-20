/**
 * Created by seal on 10/01/2017.
 */
import React, { Component } from 'react';
import { ajax } from '../utils';

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      message: '上传文件',
      files: []
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let data = new FormData();
    data.append('file', this.fileInput.files[0]);
    this.setState({
      message: '上传文件中'
    });

    ajax('/api/file', {
      method: 'POST',
      data: data,
      processData: false,
      contentType: false,
    }).then(res => {
      this.setState({
        message: '文件上传成功'
      });
      this.updateFilelist();
    }).catch(err => {
      this.setState({
        message: '文件上传失败：' + JSON.stringify(err)
      });
    });
  }

  componentDidMount() {
    this.updateFilelist();
  }

  componentWillUnmount() {

  }

  updateFilelist() {
    ajax('/api/file').then(files => {
      this.setState({
        files: files
      });
      console.log(files);
    }).catch(err => {
        console.log(err);
    });
  }

  render() {
    return (
      <div>
        <h2>上传文件</h2>
        <form onSubmit={this.handleSubmit}>
          <input className="form-control" type="file" ref={input => this.fileInput = input}/>
          <button className="btn btn-primary btn-block">上传</button>
          <div className="alert alert-info">
            <p>{this.state.message}</p>
          </div>
        </form>
        <table style={{maxWidth: '1024px'}} className="table">
          <thead>
          <tr>
            <th>文件名</th>
            <th>文件类型</th>
            <th>文件大小</th>
            <th>下载链接</th>
          </tr>
          </thead>
          <tbody>
          {this.state.files.map(file => {
            return (
              <tr key={file._id}>
                <td>{file.originalname}</td>
                <td>{file.mimetype}</td>
                <td>{file.size}</td>
                <td><a href={`/uploads/${file.originalname}?filename=${file.filename}`}>下载</a></td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FileManager;
