#!/usr/bin/env node
import {Command} from 'commander/esm.mjs'
import api from './index.js'

// const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'))
const program = new Command()

program
  .version('1.0.3')
  .command('add <task-name...>')
  .description('add a todo')
  .action(async (args) => {
    await api.add(args)
  })

program.command('clear')
  .description('clear all todos')
  .action(async () => {
    await api.clear()
  })

program.command('ls')
  .description('list all todos')
  .action(() => {
    void api.showAll()
  })

if (process.argv.length === 2) {
  void api.showAll()
} else {
  program.parse()
}

