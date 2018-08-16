import React, { Component } from 'react';
import Modal from 'react-modal';
import './App.css';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import styled from 'styled-components';

export const MarginDiv = styled.div`
  margin: 2em 0;
  overflow: hidden;
`

export const MarginalDiv = styled.div`
  margin: 2em 0;
  overflow: hidden;
  width: min-content;
`

export const Leaderboard = styled.div`
  display: flex;
  border: 1px solid red;
  border-radius: 3px;
  width: max-content;
  height: min;
  margin: auto;
  background: palevioletred;
  
`

export const LeaderboardItem = styled.div`
    display: flex;
    border: 1px solid blue;
	background: papayawhip;
	color: palevioletred;
	width: 500px;
    
`




