import { ethers } from 'hardhat'
import { expect } from 'chai'
import type { Hub } from '../typechain'
import { createContract } from '../utils/createContract'
import { createIpfsClient } from '../utils/ipfsClient'
import { testData } from './data'
import axios from 'axios'

const bytes32Address =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

describe('Hub', () => {
  it('It should create a note', async () => {
    const [address] = await ethers.getSigners()

    // Create contract & IPFS client
    const hub = (await createContract<Hub>('Hub')).connect(address)
    const ipfsClient = createIpfsClient()

    for (let i = 0; i < testData.length; i++) {
      // Store data on IPFS
      const { path } = await (await ipfsClient).add(JSON.stringify(testData[i]))

      // Create a note
      const ipfsLink = `https://ipfs.infura.io:5001/api/v0/cat?arg=${path}`
      await hub.createNote(ipfsLink)

      // Get the note content
      const notes = await hub.getNotes()
      const noteUri = await hub.getContent(notes[i].contentId)

      // Check the link is correct
      expect(noteUri).to.equal(ipfsLink)

      // Fetch the content
      const content = await (await axios.get(noteUri)).data

      // Check the content is correct
      expect(JSON.stringify(testData[i])).to.equal(JSON.stringify(content))
    }
  })

  it('It should modify a note', async () => {
    const [address] = await ethers.getSigners()

    // Create contract & IPFS client
    const hub = (await createContract<Hub>('Hub')).connect(address)
    const ipfsClient = createIpfsClient()

    // Store data on IPFS
    const { path } = await (await ipfsClient).add(JSON.stringify(testData[0]))

    // Create a note
    const ipfsLink = `https://ipfs.infura.io:5001/api/v0/cat?arg=${path}`
    await hub.createNote(ipfsLink)

    // Get the note content
    const notes = await hub.getNotes()
    const noteUri = await hub.getContent(notes[0].contentId)

    // Fetch the content
    const { id, title, content, updatedAt, createdAt } = await (
      await axios.get(noteUri)
    ).data

    const newData = {
      id,
      title: title + ' new data',
      content: 'new data here ' + content,
      updatedAt: new Date().toISOString(),
      createdAt
    }

    // Store new data on IPFS
    const { path: newPath } = await (
      await ipfsClient
    ).add(JSON.stringify(newData))

    // Create a new link
    const newIpfsLink = `https://ipfs.infura.io:5001/api/v0/cat?arg=${newPath}`
    await hub.updateNote(notes[0].noteId, newIpfsLink)

    // Get the new note content
    const newNotes = await hub.getNotes()
    const newNoteUri = await hub.getContent(newNotes[0].contentId)

    // Fetch the new content
    const newContent = await (await axios.get(newNoteUri)).data

    // Check the content is correct
    expect(id).to.equal(newContent.id)
    expect(title + ' new data').to.equal(newContent.title)
    expect('new data here ' + content).to.equal(newContent.content)
    expect(createdAt).to.not.equal(newContent.updatedAt)
    expect(createdAt).to.equal(newContent.createdAt)
  })

  it('It should return a note', async () => {
    const [address] = await ethers.getSigners()

    // Create contract & IPFS client
    const hub = (await createContract<Hub>('Hub')).connect(address)
    const ipfsClient = createIpfsClient()

    // Store data on IPFS
    const { path } = await (await ipfsClient).add(JSON.stringify(testData[0]))

    // Create a note
    const ipfsLink = `https://ipfs.infura.io:5001/api/v0/cat?arg=${path}`
    await hub.createNote(ipfsLink)

    // Get the note content
    const notes = await hub.getNotes()
    const note = await hub.getNote(notes[0].noteId)
    const noteUri = await hub.getContent(note.contentId)

    // Check the link is correct
    expect(noteUri).to.equal(ipfsLink)

    // Fetch the content
    const content = await (await axios.get(noteUri)).data

    // Check the content is correct
    expect(JSON.stringify(testData[0])).to.equal(JSON.stringify(content))
  })
})
