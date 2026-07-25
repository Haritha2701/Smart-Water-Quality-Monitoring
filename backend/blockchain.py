import hashlib
import json
import time

class Blockchain:
    def __init__(self):
        self.chain = []
        self.create_block(previous_hash='0')

    def create_block(self, data=None, previous_hash=''):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': str(time.time()),
            'data': data,
            'previous_hash': previous_hash
        }
        block['hash'] = self.hash(block)
        self.chain.append(block)
        return block

    def hash(self, block):
        encoded = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()

    def add_block(self, data):
        prev_block = self.chain[-1]
        return self.create_block(data, prev_block['hash'])