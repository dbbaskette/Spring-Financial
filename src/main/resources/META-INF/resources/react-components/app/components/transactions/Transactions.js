import React, {Component} from 'react';
import Item from './Items';
import Helpers from '../../util/helpers';
import cookie from 'react-cookies'

export default class Transactions extends Component {
    constructor(){
        super();
        this.state= {
            transactions: [],
            category: '',
            amount: '',
            note: '',
            balance: 120,
        };
        this.listTransactions = this.listTransactions.bind(this);
        this.newTransaction = this.newTransaction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.updateNote = this.updateNote.bind(this);
    }

    deleteTransaction(index){
        let transactions = this.state.transactions;
        let transaction = transactions[index];
        Helpers.deleteTransaction(transaction.id, (resp) => {
            if(resp.completed){
                let balance;
                if(transaction.category === "deposit") balance = this.state.balance - transaction.amount;
                else balance = parseInt(this.state.balance) + parseInt(transaction.amount);
                transactions.splice(index, 1);
                this.setState({
                    transactions,
                    balance
                });
            } else {
                let sfCookie = cookie.load("sf");
                if(!sfCookie) this.props.history.push("/login");
                else console.log("transaction was not able to be deleted");
            }
        })
    }

    updateNote(transaction, index){
        let transactions = this.state.transactions;
        transactions[index] = transaction;
        this.setState({transactions});
    }

    listTransactions() {
        if(this.state.transactions.length >= 1) {
            return this.state.transactions.map((transaction, index) => {
                    return (
                        <div>
                            <Item
                                transaction={transaction}
                                index={index}
                                key={index}
                                deleteTransaction={this.deleteTransaction}
                                updateNote={this.updateNote}
                            />
                        </div>
                    )
            });
        }
        return (
            <div>
                <p>No Transactions added</p>
            </div>
        )
    }
    newTransaction(e){
        e.preventDefault();
            let transaction = {
                category: this.state.category,
                amount: this.state.amount,
                note: this.state.note
            };
            Helpers.postTransaction(transaction, (resp) => {
                if(resp.completed){
                    let balance;
                    if(this.state.category === "deposit") balance = parseInt(this.state.balance) + parseInt(this.state.amount);
                    else balance = this.state.balance - this.state.amount;
                    transaction.id = resp.transactionId;
                    this.setState({
                        category: '',
                        amount: '',
                        note: '',
                        balance,
                        transactions: [...this.state.transactions, transaction]
                    });
                }
                else {
                    let sfCookie = cookie.load("sf");
                    if(!sfCookie) this.props.history.push("/login");
                    else console.log("transaction was not able to be deleted");
                }
            });
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    componentWillMount() {
        let sfCookie = cookie.load("sf");
        if (sfCookie) {
            this.props.handleLoggedIn(true);
            Helpers.getTransaction((resp) =>{
                if(resp){
                    let balance = this.state.balance;
                    resp.map((transaction, index) => {
                        if(transaction.category === "deposit") balance += transaction.amount;
                        else balance -= transaction.amount;
                        if ((index + 1) === resp.length) {
                            this.setState({
                                transactions: resp,
                                balance
                            });
                        }
                    });
                }
            });
        } else {
            this.props.history.push('/login');
        }
    }
    render(){
        return (
            <div>
                <div>
                    <h3 id="balanceHeader">Balance</h3>
                    <p id="balance">{this.state.balance}</p>
                </div>
                <div id='addTransaction'>
                    <form id='newTransactionForm' onSubmit={(e)=> this.newTransaction(e)}>
                        <select className="catagory" value={this.state.category} onChange={this.handleChange} name="category" required>
                            <option value="">Select the best option</option>
                            <option value="shopping">Shopping </option>
                            <option value="car"> Car</option>
                            <option value="food">Food</option>
                            <option value="house">House</option>
                            <option value="medical">Medical</option>
                            <option value="deposit">Deposit</option>
                        </select>
                        <input value={this.state.amount} onChange={this.handleChange} name="amount" type="number" required placeholder='Amount'/>
                        <input value={this.state.note} onChange={this.handleChange} name='note' type="text" maxLength="25" placeholder='Note'/>
                        <input type="submit"/>
                    </form>
                </div>
                {this.listTransactions()}
            </div>
        )
    }
}
