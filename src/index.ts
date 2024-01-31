import {
  SelfProof,
  Field,
  ZkProgram,
  verify,
  Proof,
  Provable,
  Bytes,
  Hash,
  Poseidon,
} from 'o1js';

class Bytes32 extends Bytes(32) {}

let MyProgram = ZkProgram({
  name: 'example-with-input',
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

        for (let i = 0; i < 232; i++) {
          const bytes = Bytes32.fromHex('646f67');
          const h = Poseidon.hash(bytes.toFields());
          let h1 = Hash.SHA3_256.hash(bytes);
          let h2 = Hash.SHA3_384.hash(bytes);
          h.assertEquals(h);
        }
      },
    },
  },
});

MyProgram.publicInputType satisfies typeof Field;
MyProgram.publicOutputType satisfies Provable<void>;

let MyProof = ZkProgram.Proof(MyProgram);

console.log('program digest', MyProgram.digest());

console.log('compiling MyProgram...');
let { verificationKey } = await MyProgram.compile({ forceRecompile: true });
console.log('verification key', verificationKey.data.slice(0, 10) + '..');
console.log('MyProgram: ', MyProgram.analyzeMethods());

console.log('proving base case...');
let proof = await MyProgram.baseCase(Field(0));

// type sanity check
proof satisfies Proof<Field, void>;

console.log('verify...');
let ok = await verify(proof.toJSON(), verificationKey);
console.log('ok?', ok);

console.log('verify alternative...');
ok = await MyProgram.verify(proof);
console.log('ok (alternative)?', ok);

const N = 1000;

console.log('starting proof loop...');
for (let i = 1; i < N; i++) {
  console.log('proof run #', i);
  const newProof = await MyProgram.inductiveCase(Field(i), proof);
  let json_proof = newProof.toJSON();
  let from_json_proof = MyProof.fromJSON(json_proof);
  ok = await verify(from_json_proof, verificationKey);
  proof = newProof;
}
