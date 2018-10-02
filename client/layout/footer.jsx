import '../assets/styles/footer.styl'

export default {
  data () {
    return {
      author: 'Tulies'
    }
  },
  render () {
    return (
      <div id="footer">
        <span>Written by {this.authors}</span>
      </div>
    )
  }
}
