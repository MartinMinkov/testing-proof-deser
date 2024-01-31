import {
  SelfProof,
  Field,
  ZkProgram,
  verify,
  Bytes,
  Hash,
  Poseidon,
} from 'o1js';

class Bytes32 extends Bytes(32) {}

const N = 230;

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

        for (let i = 0; i < N; i++) {
          const bytes = Bytes32.fromHex('646f67');
          const h = Poseidon.hash(bytes.toFields());
          Hash.SHA3_256.hash(bytes);
          Hash.SHA3_384.hash(bytes);
          h.assertEquals(h);
        }
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
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);

        for (let i = 0; i < N; i++) {
          const bytes = Bytes32.fromHex('646f67');
          const h = Poseidon.hash(bytes.toFields());
          Hash.SHA3_256.hash(bytes);
          Hash.SHA3_384.hash(bytes);
          h.assertEquals(h);
        }
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
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);

        for (let i = 0; i < N; i++) {
          const bytes = Bytes32.fromHex('646f67');
          const h = Poseidon.hash(bytes.toFields());
          Hash.SHA3_256.hash(bytes);
          Hash.SHA3_384.hash(bytes);
          h.assertEquals(h);
        }
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
      privateInputs: [SelfProof],
      method(input: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(input);

        for (let i = 0; i < N; i++) {
          const bytes = Bytes32.fromHex('646f67');
          const h = Poseidon.hash(bytes.toFields());
          Hash.SHA3_256.hash(bytes);
          Hash.SHA3_384.hash(bytes);
          h.assertEquals(h);
        }
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
let verificationKeyA = (await ProgramA.compile({ forceRecompile: true }))
  .verificationKey;
console.log('verification key', verificationKeyA.data.slice(0, 10) + '...');

console.log('ProgramA: ', ProgramA.analyzeMethods());

console.log('compiling ProgramB...');
let verificationKeyB = (await ProgramB.compile({ forceRecompile: true }))
  .verificationKey;
console.log('verification key', verificationKeyB.data.slice(0, 10) + '...');
console.log('ProgramB: ', ProgramB.analyzeMethods());

console.log('compiling ProgramC...');
let verificationKeyC = (await ProgramC.compile({ forceRecompile: true }))
  .verificationKey;
console.log('verification key', verificationKeyC.data.slice(0, 10) + '...');
console.log('ProgramC: ', ProgramC.analyzeMethods());

console.log('compiling ProgramD...');
let verificationKeyD = (await ProgramD.compile({ forceRecompile: true }))
  .verificationKey;
console.log('verification key', verificationKeyD.data.slice(0, 10) + '..');
console.log('ProgramD: ', ProgramD.analyzeMethods());

console.log('proving base case...');
let proof = await ProgramA.baseCase(Field(0));
console.log('verify...');
let ok = await verify(proof.toJSON(), verificationKeyA);
console.log('ok?', ok);

console.log('starting proof loop...');
for (let i = 1; i < 100; i++) {
  console.log('proof run #', i);
  console.log('proving inductive case...');

  let proofA = await ProgramA.inductiveCase(Field(i), proof);
  console.log('verify...');
  ok = await verify(proofA.toJSON(), verificationKeyA);
  console.log('ok?', ok);
  proof = proofA;

  console.log('proving inductive case...');
  let proofB = await ProgramB.inductiveCase(Field(i + 1), proofA);
  console.log('verify...');
  ok = await verify(proofB.toJSON(), verificationKeyB);
  console.log('ok?', ok);

  console.log('proving inductive case...');
  let proofC = await ProgramC.inductiveCase(Field(i + 2), proofB);
  console.log('verify...');
  ok = await verify(proofC.toJSON(), verificationKeyC);
  console.log('ok?', ok);

  console.log('proving inductive case...');
  let proofD = await ProgramD.inductiveCase(Field(i + 3), proofC);
  console.log('verify...');
  ok = await verify(proofD.toJSON(), verificationKeyD);
  console.log('ok?', ok);
}
