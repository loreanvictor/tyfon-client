import { expect, should } from 'chai'; should();
import { server, Module } from 'tyfon-server';
import { invoke } from '../index';


function test(module: Module, func: (origin: string, clean: () => void) => void) {
  const s = server(module).listen(3127, () => func('http://localhost:3127', () => s.close()));
}


describe('tyfon-client', () => {
  describe('invoke()', () => {
    it('should properly connect to get endpoints.', done => {
      test({
        getMsg: async (user: {name: string}) => `Hellow ${user.name}!`
      }, (origin, clean) => {
        invoke(origin, 'getMsg', { name: 'Jack' }).then(v => {
          clean();
          v.should.equal('Hellow Jack!');
          done();
        }).catch(err => { clean(); done(err) });
      });
    });
  });
});
