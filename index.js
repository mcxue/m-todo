import db from './db.js'
import inquirer from 'inquirer'

const add = async (args) => {
  const list = await db.read()
  args.forEach(item => {
    list.push({
      name: item,
      done: false
    })
  })
  await db.write(list)
  console.log('添加成功')
}

const clear = async () => {
  await db.write([])
  console.log('清除成功')
}

const askForRenameTask = (list, index) => {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: '输入想要修改成什么名字',
    default() {
      return list[index].name
    },
  }).then((answer) => {
    list[index].name = answer.name
    db.write(list).then(() => {console.log(`已成功修改为"${answer.name}"`)})
  })
}

const askForTaskOperation = (list, index) => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '选择操作',
    choices() {
      return [
        {name: '退出', value: -1, short: 'quit'},
        {name: '已完成', value: 'finished', short: 'finished'},
        {name: '未完成', value: 'unfinished', short: 'finished'},
        {name: '改名字', value: 'rename', short: 'rename'},
        {name: '删除', value: 'delete', short: 'delete'},
      ]
    }
  }).then((answer) => {
    switch (answer.action) {
      case 'finished':
        list[index].done = true
        db.write(list).then(() => {console.log('已标记为完成')})
        break
      case 'unfinished':
        list[index].done = false
        db.write(list).then(() => {console.log('已标记为未完成')})
        break
      case 'rename':
        askForRenameTask(list, index)
        break
      case 'delete':
        list.splice(index, 1)
        db.write(list).then(() => {console.log('已删除')})
        break
    }
  })
}

const askForCreateTask = (list) => {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: '输入任务名称',
  }).then((answer) => {
    if (!answer.name) return
    list.push({
      name: answer.name,
      done: false
    })
    db.write(list).then(() => {console.log('已成功创建任务')})
  })
}

const askForList = (list) => {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'action',
        message: '选择要操作的任务',
        choices() {
          return [
            {name: '退出', value: -1, short: 'quit'},
            ...list.map((item, index) => ({
              name: `${index + 1} [${item.done ? '√' : '_'}] ${item.name}`,
              value: index,
              short: item.name
            })),
            {name: '新建任务', value: -2, short: 'create'}
          ]
        }
      }
    )
    .then((answers) => {
      if (answers.action >= 0) {
        askForTaskOperation(list, answers.action)
      }
      if (answers.action === -2) {
        askForCreateTask(list)
      }
    })
}

const showAll = async () => {
  const list = await db.read()
  askForList(list)
}

const api = {
  add,
  clear,
  showAll
}

export default api