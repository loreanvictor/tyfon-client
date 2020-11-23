import { invoke } from '../src';

invoke('http://localhost:8000', 'getMsg', 'Jack').then(console.log);