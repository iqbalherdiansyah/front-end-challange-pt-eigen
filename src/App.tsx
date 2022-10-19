import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import Home from './Home/Home';

function App() {
  const { Content } = Layout;

  return (
    <Layout style={{ backgroundColor : 'var(--black)' }}>
      <Content>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<p>Path not resolved</p>} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;