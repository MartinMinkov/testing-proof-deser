import { SelfProof, Field, ZkProgram, verify, Proof, Provable } from 'o1js';

let ProgramA = ZkProgram({
  name: 'A',
  publicInput: Field,

  methods: {
    baseCase: {
      privateInputs: [],
      method(input: Field) {
        input.assertEquals(Field(0));
      },
    },

    inductiveCase: {
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },
  },
});

//let ProgramAProof = ZkProgram.Proof(ProgramA);
class ProgramAProof extends ZkProgram.Proof(ProgramA) {}

let ProgramB = ZkProgram({
  name: 'B',
  publicInput: Field,

  methods: {
    baseCase: {
      privateInputs: [],
      method(input: Field) {
        input.assertEquals(Field(0));
      },
    },

    inductiveCase: {
      privateInputs: [ProgramAProof],
      method(input: Field, earlierProof: ProgramAProof) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },
  },
});

class ProgramBProof extends ZkProgram.Proof(ProgramB) {}

let ProgramC = ZkProgram({
  name: 'C',
  publicInput: Field,

  methods: {
    baseCase: {
      privateInputs: [],
      method(input: Field) {
        input.assertEquals(Field(0));
      },
    },

    inductiveCase: {
      privateInputs: [ProgramBProof],
      method(input: Field, earlierProof: ProgramBProof) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },
  },
});

class ProgramCProof extends ZkProgram.Proof(ProgramC) {}

let ProgramD = ZkProgram({
  name: 'D',
  publicInput: Field,

  methods: {
    baseCase: {
      privateInputs: [],
      method(input: Field) {
        input.assertEquals(Field(0));
      },
    },

    inductiveCase: {
      privateInputs: [ProgramCProof],
      method(input: Field, earlierProof: ProgramCProof) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);
      },
    },
  },
});

class ProgramDProof extends ZkProgram.Proof(ProgramD) {}

console.log(
  'program digest',
  ProgramA.digest(),
  ProgramB.digest(),
  ProgramC.digest(),
  ProgramD.digest()
);

console.log('compiling ProgramA...');
let verificationKeyA = (await ProgramA.compile()).verificationKey;
console.log('verification key', verificationKeyA.data.slice(0, 10) + '...');

console.log('compiling ProgramB...');
let verificationKeyB = (await ProgramB.compile()).verificationKey;
console.log('verification key', verificationKeyB.data.slice(0, 10) + '...');

console.log('compiling ProgramC...');
let verificationKeyC = (await ProgramC.compile()).verificationKey;
console.log('verification key', verificationKeyC.data.slice(0, 10) + '...');

console.log('compiling ProgramD...');
let verificationKeyD = (await ProgramD.compile()).verificationKey;
console.log('verification key', verificationKeyD.data.slice(0, 10) + '..');

console.log('proving base case...');
let proof = await ProgramA.baseCase(Field(0));

console.log('verify...');
let ok = await verify(proof.toJSON(), verificationKeyA);
console.log('ok?', ok);

// console.log('proving inductive case...');
// proof = await ProgramB.inductiveCase(Field(1), proof);

// console.log('verify...');
// ok = await verify(proof.toJSON(), verificationKey);
// console.log('ok?', ok);

// console.log('proving inductive case...');
// proof = await ProgramC.inductiveCase(Field(1), proof);

// console.log('verify...');
// ok = await verify(proof.toJSON(), verificationKey);

// console.log('ok?', ok);

// console.log('proving inductive case...');
// proof = await ProgramD.inductiveCase(Field(1), proof);

// console.log('verify...');
// ok = await verify(proof.toJSON(), verificationKey);

// const N = 1000;

// console.log('starting proof loop...');
// for (let i = 1; i < N; i++) {
//   console.log('proof run #', i);
//   const newProof = await ProgramD.inductiveCase(Field(i), proof);
//   let json_proof = newProof.toJSON();
//   let from_json_proof = ProgramDProof.fromJSON(json_proof);
//   ok = await verify(from_json_proof, verificationKey);
//   proof = newProof;
// }
