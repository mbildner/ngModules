describe('sequentialTimeout', function(){
  describe('')

    describe('when I call myService.one', function(){
        it('returns 1', function(){
            var $injector = angular.injector([ 'myModule' ]);
            var myService = $injector.get( 'myService' );
            expect( myService.one ).toEqual(1);
        })

    }

});
