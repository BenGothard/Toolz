from flask import Flask, request, jsonify
from aggregator import aggregate_answers

app = Flask(__name__)


@app.route('/query')
def query():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({'error': 'missing query'}), 400
    answer = aggregate_answers(q)
    return jsonify({'answer': answer})


if __name__ == '__main__':
    app.run(debug=True)
