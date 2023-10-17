// import { enablePromise, openDatabase } from "react-native-sqlite-storage";

// const tableName = "transactionTablePJ";
// var dbName = "pjtransactiondb.db";
// enablePromise(true)

// // init db
// export const getDbConnection = async () => {
//     return openDatabase({
//         name:dbName,
//     }, () => { console.log("DB Success...") }, err => { console.log("db err-> ", err) })
// }

// //init table
// export const createTable = async (db) => {

//     const query = `CREATE TABLE IF NOT EXISTS ${tableName}(id INTEGER PRIMARY KEY AUTOINCREMENT,type varchar,duedate varchar,goldrate varchar,silverrate varchar,chitcode varchar,chitname varchar,chittype varchar,chitcate varchar,chitamt varchar,noofins varchar,weight varchar,total varchar,orderid varchar,itemgrp varchar,docno varchar,created varchar,status varchar);`;

//     await db.transaction(e => {
//         e.executeSql(query);
//     });

// }

// //init save to table
// export const saveChitToDb = async (db, data) => {

//     const query = `INSERT INTO ${tableName} (type,duedate,goldrate,silverrate,chitcode,chitname,chittype,chitcate,chitamt,noofins,weight,total,orderid,itemgrp,docno,created,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`

//     return db.transaction(e => {
//         e.executeSql(query,[data.type,data.due,
//             data.gold,data.silver,data.ccode,data.cname,
//             data.ctype,data.ccate,data.camt,data.noins,
//             data.wei,data.ptot,data.ordid,data.itgrp,data.doc,data.time,data.status]);
//     });

// }

// //init get data from table
// export const getChitData = async (db) => {
//     const data = [];
//     await db.transaction(e => {
//         e.executeSql(
//             `SELECT * FROM ${tableName}`,
//             [], (res, result) => {
//                 for (var i = 0; i < result.rows.length; i++) {
//                     //console.log(result.rows.item(i))
//                     data.push(result.rows.item(i))
//                 }

//                 //console.log(data)
//             }
//         )
//     });
//     return data;
// }

// //init delete table
// export const dropTable = async (db) => {
//     return db.transaction(e => {
//         e.executeSql(`drop table ${tableName}`);
//     });
// }

// //init delete item 
// export const deleteItem = async (db , id) => {
//     const query = `DELETE FROM ${tableName} WHERE id = ${id}`;
//     await db.transaction(e=>{
//         e.executeSql(query)
//     })
// }