import React, { Component } from 'react';
import XMLdata from '../assets/db.xml';
import XMLParser from 'react-xml-parser';



class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogData: [],
    };
  }

  componentDidMount() {
    this.getXmlData();
  }

    getXmlData() {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          const xmlText = xmlhttp.responseText;
          const xmlToJson = new XMLParser().parseFromString(xmlText);
          const blogData = xmlToJson.children.map((post) => {
            const postData = {};
            post.children.forEach((data) => {
              postData[data.name] = data.value;
            });
            postData.expanded = false; 
            return postData;
          });
          this.setState({ blogData });
        }
      };
      xmlhttp.open("GET", XMLdata, true);
      xmlhttp.setRequestHeader('Content-Type', 'application/xml; charset=utf-8');
      xmlhttp.send();
    }
  
  handleCardClick = (index) => {
    const { blogData } = this.state;
    const updatedBlogData = [...blogData];
    updatedBlogData[index].expanded = !updatedBlogData[index].expanded;
    this.setState({ blogData: updatedBlogData });
  };

  render() {
    const { blogData } = this.state;

    return (
      <main className="p-4">
        <div className="main-container">
          {blogData.length > 0 ? (
            blogData.map((data, index) => {
              return (
                <div className="card mb-5" key={data.date}>
                  <div className="card-horizontal" onClick={() => this.handleCardClick(index)}>
                    <img
                      className="card-img-top"
                      src={data.image_path}
                      alt="Card image cap"
                    />
                    <div className="card-body">
                      <h1 className="card-title mb-4">{data.title}</h1>
                      <p className="card-text">{data.summary}</p>
                    </div>
                  </div>
                  {data.expanded && (
                    <div className="post">
                      <h1 className="mb-4">{data.title}</h1>
                      <p className="date">{data.date}</p>
                      <p className="author">{data.author}</p>
                      <img className="my-3 w-75 mx-auto" />
                      <p>{data.body}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </main>
    );
  }
}

export default Main;

