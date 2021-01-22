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

    it('should properly handle multiple arguments.', done => {
      test({
        getAdd: async (a: number, b: number) => a + b
      }, (origin, clean) => {
        invoke(origin, 'getAdd', 21, 42).then(v => {
          clean();
          v.should.equal(21 + 42);
          done();
        }).catch(err => { clean(); done(err) });
      });
    });

    it('should properly parse date objects.', done => {
      test({
        leDate: async () => ({ date: new Date('December 17, 1995 03:24:00') })
      }, (origin, clean) => {
        invoke(origin, 'leDate').then(res => {
          clean();
          res.date.should.be.instanceOf(Date);
          res.date.getFullYear().should.equal(1995);
          done();
        }).catch(err => { clean(); done(err) });
      });
    });

    it('should properly handle undefined arguments when passed as undefined.', done => {
      test({
        getX: async (a: string | undefined, b: string) => '[' + b + ']' + ' ' + (a || 'well ...')
      }, (origin, clean) => {
        invoke(origin, 'getX', undefined, 42).then(res => {
          clean();
          res.should.equal('[42] well ...');
          done();
        });
      });
    });

    it('should properly handle undefined arguments when not passed..', done => {
      test({
        getX: async (b: string, a?: string) => '[' + b + ']' + ' ' + (a || 'well ...')
      }, (origin, clean) => {
        invoke(origin, 'getX', 42).then(res => {
          clean();
          res.should.equal('[42] well ...');
          done();
        });
      });
    });

    it('should properly handle undefined arguments when not passed with post functions as well.', done => {
      test({
        x: async (b: string, a?: string) => '[' + b + ']' + ' ' + (a || 'well ...')
      }, (origin, clean) => {
        invoke(origin, 'x', 42).then(res => {
          clean();
          res.should.equal('[42] well ...');
          done();
        });
      });
    });

    it('should properly transport falsy args.', done => {
      test({
        getX: async (a: any) => a === undefined
      }, async (origin, clean) => {
        const r1 = await invoke(origin, 'getX', '');
        const r2 = await invoke(origin, 'getX', false);
        const r3 = await invoke(origin, 'getX', 0);
        const r4 = await invoke(origin, 'getX', null);
        const r5 = await invoke(origin, 'getX', undefined);
        const r6 = await invoke(origin, 'getX');

        clean();

        r1.should.be.false;
        r2.should.be.false;
        r3.should.be.false;
        r4.should.be.true;
        r5.should.be.true;
        r6.should.be.true;

        done();
      });
    });

    it('should properly handle void functions.', done => {
      test({
        leVoid: async () => {}
      }, (origin, clean) => {
        invoke(origin, 'leVoid').then(res => {
          clean();
          expect(res).to.be.undefined;
          done();
        }).catch(err => { clean(); done(err) });
      });
    });
  });
});
